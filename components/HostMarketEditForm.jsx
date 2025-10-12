// components/HostMarketEditForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import StateSelect from '@/components/StateSelect';
import DropzoneUploader from '@/components/DropzoneUploader';
import uploadToCloudinary from '@/utils/uploadToCloudinary';
import editHostMarketAction from '@/app/actions/editHostMarketAction';
import deleteHostMarketAction from '@/app/actions/deleteHostMarketAction';
import DeleteProfileModal from '@/components/DeleteProfileModal';

const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];
const MAX_DATES = 6;

const formatPhoneDisplay = (value) => {
  const digits = String(value || '').replace(/\D/g, '').substring(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0,3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
};
const toE164 = (display) => {
  const digits = String(display || '').replace(/\D/g, '').slice(0, 10);
  return digits ? `+1${digits}` : '';
};

// Helper to convert E.164 format (+1XXXXXXXXXX) to display format
const fromE164ToDisplay = (e164) => {
  if (!e164) return '';
  const digits = String(e164).replace(/\D/g, '');
  // Remove leading '1' if present (US country code)
  const phone = digits.startsWith('1') ? digits.slice(1) : digits;
  return formatPhoneDisplay(phone);
};

export default function HostMarketEditForm({ marketData, userEmail }) {
  const router = useRouter();

  const [profileUrl, setProfileUrl] = useState(marketData?.hostfm_profile_image || '');
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [addrPhoneDisplay, setAddrPhoneDisplay] = useState('');
  const [showWebsite, setShowWebsite] = useState(false);
  const [stallAvail, setStallAvail] = useState(false);
  const [scheduleMode, setScheduleMode] = useState('weekly'); // 'weekly' | 'random'
  const [dates, setDates] = useState([{ id: 1, date: '', time: '' }]);
  const [nextId, setNextId] = useState(2);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pre-populate form fields on mount
  useEffect(() => {
    if (marketData) {
      // Pre-populate phone number
      if (marketData.hostfm_address?.hostfm_phone) {
        setAddrPhoneDisplay(fromE164ToDisplay(marketData.hostfm_address.hostfm_phone));
      }

      // Pre-populate website checkbox
      setShowWebsite(!!marketData.hostfm_website);

      // Pre-populate stall availability
      setStallAvail(marketData.stall_avail === true || marketData.stall_avail === 'true');

      // Pre-populate schedule mode based on existing data
      const hasWeeklySched = marketData.hostfm_weekly_sched?.weekly_sched === true ||
                             marketData.hostfm_weekly_sched?.weekly_sched === 'true';
      const hasRandomDates = marketData.hostfm_dates?.hostfm_randomdates === true ||
                             marketData.hostfm_dates?.hostfm_randomdates === 'true';

      if (hasWeeklySched) {
        setScheduleMode('weekly');
      } else if (hasRandomDates) {
        setScheduleMode('random');

        // Pre-populate dates array if using random dates schedule
        if (marketData.hostfm_dates?.dates && Array.isArray(marketData.hostfm_dates.dates)) {
          const existingDates = marketData.hostfm_dates.dates
            .filter(d => d.date) // Only include dates with actual date values
            .map((d, idx) => ({
              id: idx + 1,
              date: d.date || '',
              time: d.time || ''
            }));

          if (existingDates.length > 0) {
            setDates(existingDates);
            setNextId(existingDates.length + 1);
          }
        }
      }
    }
  }, [marketData]);

  const handleDropzoneUpload = async (file) => {
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      setProfileUrl(url);
      setUploadedFileName(file.name);
    } catch (err) {
      console.error('Cloudinary upload failed:', err);
      alert('Upload failed. Please try again.');
    }
  };

  const handleAddDateRow = () => {
    setDates((prev) => {
      if (prev.length >= MAX_DATES) return prev;
      const row = { id: nextId, date: '', time: '' };
      setNextId((n) => n + 1);
      return [...prev, row];
    });
  };

  const handleRemoveDateRow = (idx) => {
    setDates((prev) => {
      if (prev.length <= 1) return [{ id: 1, date: '', time: '' }];
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleDateChange = (idx, field, value) => {
    setDates((prev) => prev.map((row, i) => (i === idx ? { ...row, [field]: value } : row)));
  };

  const normalizeWebsite = (raw) => {
    if (!raw) return '';
    let s = String(raw).trim();
    if (!s) return '';
    if (!/^https?:\/\//i.test(s)) s = `https://${s}`;
    try {
      const u = new URL(s);
      if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
      return s.replace(/\/$/, '');
    } catch {
      return '';
    }
  };

  const handleDelete = async () => {
    try {
      const result = await deleteHostMarketAction(marketData.id);
      if (result.ok) {
        router.push('/hostfarmmarkets');
        router.refresh();
      }
      return result;
    } catch (error) {
      console.error('Delete error:', error);
      return { ok: false, error: 'Failed to delete market' };
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);

    // Add the market ID for editing
    form.set('id', marketData.id);

    form.set('hostfm_profile_image', profileUrl || '');

    const addrPhone = toE164(addrPhoneDisplay);
    if (addrPhone) form.set('hostfm_address.hostfm_phone', addrPhone);

    const site = normalizeWebsite(form.get('hostfm_website'));
    if (site) form.set('hostfm_website', site); else form.delete('hostfm_website');

    form.set('hostfm_active', 'true');
    form.set('stall_avail', stallAvail ? 'true' : 'false');
    const weekly = scheduleMode === 'weekly';
    form.set('hostfm_weekly_sched.weekly_sched', weekly ? 'true' : 'false');
    form.set('hostfm_dates.hostfm_randomdates', weekly ? 'false' : 'true');

    if (!weekly) {
      const capped = dates.slice(0, MAX_DATES);
      capped.forEach((row, idx) => {
        if (row.date) {
          form.set(`hostfm_dates.dates[${idx}].date`, row.date);
          form.set(`hostfm_dates.dates[${idx}].time`, row.time || '');
        }
      });
      for (let i = capped.length; i < MAX_DATES + 2; i++) {
        form.delete(`hostfm_dates.dates[${i}].date`);
        form.delete(`hostfm_dates.dates[${i}].time`);
      }
    } else {
      dates.forEach((_, idx) => {
        form.delete(`hostfm_dates.dates[${idx}].date`);
        form.delete(`hostfm_dates.dates[${idx}].time`);
      });
    }

    try {
      const res = await editHostMarketAction(form);

      if (res.ok) {
        // Success - redirect to host markets page
        router.push('/hostfarmmarkets');
        router.refresh();
      } else {
        alert(res.error || 'There was a problem updating your market. Please try again.');
      }
    } catch (err) {
      console.error('Submission failed:', err);
      alert('There was a problem updating your market. Please check your inputs and try again.');
    }
  };

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-white p-4 rounded border">
          <div>
            <h1 className="text-3xl font-bold mb-4">Edit Your Hosted Farmers' Market</h1>
            <p className="text-black text-xl mb-6">
              Update the details below to save changes to your market profile. You can choose either a weekly
              schedule or specific random dates.
            </p>
          </div>
          <p className="text-black">
            LivLoco will never sell or share private account information. However, public
            profile fields (name, address, schedule) will be visible to visitors when shared.
          </p>
        </div>

        <div className="bg-white p-4 rounded border space-y-4">
          <div>
            <label htmlFor="hostfm_name" className="block font-bold mb-1">
              Host Market Name <span className="text-red-500">required</span>
            </label>
            <input
              id="hostfm_name"
              name="hostfm_name"
              type="text"
              required
              defaultValue={marketData?.hostfm_name || ''}
              className="border rounded w-full py-2 px-3"
            />
          </div>

          <div>
            <label htmlFor="hostfm_description"  className="block font-bold mb-1">
              Description <span className="text-red-500">required</span>
            </label>
            <textarea
              id="hostfm_description"
              name="hostfm_description"
              required
              rows={4}
              defaultValue={marketData?.hostfm_description || ''}
              className="border rounded w-full py-2 px-3"
              placeholder="Tell us about your market...where and why do you exist?"
              maxLength={500}
            />
          </div>

          <div>
            <label htmlFor="hostfm_type" className="block font-bold mb-1">
              Market Type
            </label>
            <input
              id="hostfm_type"
              name="hostfm_type"
              type="text"
              defaultValue={marketData?.hostfm_type || ''}
              className="border rounded w-full py-2 px-3"
              placeholder="e.g., Produce and Artisan Market,  Farmers Market, Flower Market, Food Truck Gathering..."
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded border space-y-2">
          <label className="block font-bold mb-1">Profile Image</label>
          {profileUrl && (
            <div className="mb-2">
              <img src={profileUrl} alt="Market profile" className="h-32 w-32 object-cover rounded border" />
            </div>
          )}
          <DropzoneUploader
            label="Upload a new profile image for your market (optional)"
            onUpload={handleDropzoneUpload}
            uploadedFileName={uploadedFileName}
            accept="image/*"
          />
          <input type="hidden" name="hostfm_profile_image" value={profileUrl} />
        </div>

        <div className="bg-white p-4 rounded border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block font-bold mb-1">
              Email (will not be published but used for member messaging alerts)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              defaultValue={userEmail || marketData?.email || ''}
              readOnly
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div>
            <label htmlFor="hostfm_address_hostfm_phone" className="block font-bold mb-1">
              Market Phone (optional)
            </label>
            <input
              id="hostfm_address_hostfm_phone"
              name="hostfm_address.hostfm_phone_display"
              type="tel"
              placeholder="(123) 456-7890"
              value={addrPhoneDisplay}
              onChange={(e) => setAddrPhoneDisplay(formatPhoneDisplay(e.target.value))}
              className="border rounded w-full py-2 px-3"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded border space-y-4">
          <h3 className="text-xl font-semibold">Market Address<span className="text-red-500"> required</span></h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="add_line1" className="block font-bold mb-1">Address Line 1</label>
              <input
                id="add_line1"
                name="hostfm_address.add_line1"
                defaultValue={marketData?.hostfm_address?.add_line1 || ''}
                className="border rounded w-full py-2 px-3"
                autoComplete="address-line1"
                required
              />
            </div>
            <div>
              <label htmlFor="add_line2" className="block font-bold mb-1">Address Line 2</label>
              <input
                id="add_line2"
                name="hostfm_address.add_line2"
                defaultValue={marketData?.hostfm_address?.add_line2 || ''}
                className="border rounded w-full py-2 px-3"
                autoComplete="address-line2"
              />
            </div>
            <div>
              <label htmlFor="city" className="block font-bold mb-1">City</label>
              <input
                id="city"
                name="hostfm_address.city"
                defaultValue={marketData?.hostfm_address?.city || ''}
                className="border rounded w-full py-2 px-3"
                autoComplete="address-level2"
                required
              />
            </div>
            <div>
              <label htmlFor="state_code" className="block font-bold mb-1">State</label>
              <StateSelect
                id="state_code"
                name="hostfm_address.state_code"
                defaultValue={marketData?.hostfm_address?.state_code || ''}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>
            <div>
              <label htmlFor="zipcode" className="block font-bold mb-1">ZIP</label>
              <input
                id="zipcode"
                name="hostfm_address.zipcode"
                defaultValue={marketData?.hostfm_address?.zipcode || ''}
                className="border rounded w-full py-2 px-3"
                inputMode="numeric"
                autoComplete="postal-code"
                pattern="^\d{5}(-\d{4})?$"
                title="Enter a valid 5-digit ZIP (e.g., 48846 or 48846-1234)"
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block font-bold mb-1">Country</label>
              <input
                id="country"
                name="hostfm_address.country"
                defaultValue={marketData?.hostfm_address?.country || 'USA'}
                readOnly
                className="border rounded w-full py-2 px-3"
                autoComplete="country"
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded border space-y-3">
          <div className="flex items-center gap-2">
            <input
              id="toggle_site"
              type="checkbox"
              checked={showWebsite}
              onChange={(e) => setShowWebsite(e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="toggle_site" className="font-medium">Add a website</label>
          </div>
          {showWebsite && (
            <div>
              <label htmlFor="hostfm_website" className="block font-bold mb-1">Website URL</label>
              <input
                id="hostfm_website"
                name="hostfm_website"
                type="url"
                defaultValue={marketData?.hostfm_website || ''}
                placeholder="https://example.com"
                className="border rounded w-full py-2 px-3"
              />
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded border space-y-3">
          <div className="flex items-center gap-2">
            <input
              id="stall_avail"
              name="stall_avail"
              type="checkbox"
              checked={stallAvail}
              onChange={(e) => setStallAvail(e.target.checked)}
              className="h-5 w-5"
            />
            <label htmlFor="stall_avail" className="font-medium">Stall availability</label>
          </div>
          {stallAvail && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="stall_pricing" className="block font-bold mb-1">Stall Pricing</label>
                <input
                  id="stall_pricing"
                  name="stall_pricing"
                  defaultValue={marketData?.stall_pricing || ''}
                  className="border rounded w-full py-2 px-3"
                  placeholder="e.g., free"
                />
              </div>
              <div>
                <label htmlFor="stall_size" className="block font-bold mb-1">Stall Size</label>
                <input
                  id="stall_size"
                  name="stall_size"
                  defaultValue={marketData?.stall_size || ''}
                  className="border rounded w-full py-2 px-3"
                  placeholder="e.g., 20' x 20'"
                />
              </div>
              <div>
                <label htmlFor="stall_included" className="block font-bold mb-1">Included</label>
                <input
                  id="stall_included"
                  name="stall_included"
                  defaultValue={marketData?.stall_included || ''}
                  className="border rounded w-full py-2 px-3"
                  placeholder="e.g., electric, nothing"
                />
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded border space-y-4">
          <h3 className="text-xl font-semibold">Choose Schedule Type</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="schedule_mode"
                value="weekly"
                checked={scheduleMode === 'weekly'}
                onChange={() => setScheduleMode('weekly')}
              />
              <span>Weekly hours</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="radio"
                name="schedule_mode"
                value="random"
                checked={scheduleMode === 'random'}
                onChange={() => setScheduleMode('random')}
              />
              <span>Random dates</span>
            </label>
          </div>

          <input type="hidden" name="hostfm_weekly_sched.weekly_sched" value={scheduleMode === 'weekly' ? 'true' : 'false'} />
          <input type="hidden" name="hostfm_dates.hostfm_randomdates" value={scheduleMode === 'random' ? 'true' : 'false'} />

          {scheduleMode === 'weekly' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {DAYS.map((d) => (
                <div key={d}>
                  <label htmlFor={`hostfm_weekly_sched_${d}_hours`} className="block text-sm font-medium capitalize mb-1">{d} hours</label>
                  <input
                    id={`hostfm_weekly_sched_${d}_hours`}
                    name={`hostfm_weekly_sched.${d}_hours`}
                    defaultValue={marketData?.hostfm_weekly_sched?.[`${d}_hours`] || ''}
                    placeholder="e.g., 9am - 5pm, closed"
                    className="border rounded w-full py-2 px-3"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-sm text-gray-600">{dates.length} / {MAX_DATES} dates</div>
              {dates.map((row, idx) => (
                <div key={`date-${row.id}`} className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => handleDateChange(idx, 'date', e.target.value)}
                      className="border rounded w-full py-2 px-3"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium mb-1">Time window</label>
                    <input
                      type="text"
                      placeholder="e.g., 10:45 AM – 2:05 PM"
                      value={row.time}
                      onChange={(e) => handleDateChange(idx, 'time', e.target.value)}
                      className="border rounded w-full py-2 px-3"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      onClick={() => handleRemoveDateRow(idx)}
                      className="text-sm text-red-700 hover:text-red-800 underline decoration-dotted underline-offset-4"
                      aria-label={`Remove date ${idx +1}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDateRow}
                disabled={dates.length >= MAX_DATES}
                className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-semibold bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400"
                title={dates.length >= MAX_DATES ? 'Maximum of 6 dates reached' : 'Add another date'}
              >
                {dates.length >= MAX_DATES ? 'Max 6 dates reached' : 'Add another date'}
              </button>
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="w-full rounded-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5"
            title="Update Host Market"
          >
            Update LocoMarket
          </button>
        </div>

        <div className="bg-white p-4 rounded border">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-red-700">Danger Zone</h3>
            <p className="text-gray-700">
              Once you delete your LocoMarket profile, you can always come back and create another LocoMarket Post. However, you will loose all your votes and click statistics that are tied to this post id. 
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors"
            >
              Delete LocoMarket
            </button>
          </div>
        </div>
      </form>

      <DeleteProfileModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        profileType="locomarket"
      />
    </>
  );
}
