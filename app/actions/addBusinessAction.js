'use server';

async function addBusinessAction(formData) {
    console.log('addBusiness action');
}

export default addBusinessAction;

// some suggestions on handleing submit
// const handleSubmit = async () => {
//   const payload = {
//     locobiz_address: {
//       post_permission: showStoreFrontForm,  // ✅ This will be true or false
//     },
//     // ...other fields
//   };

//   await fetch('/api/submit', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(payload),
//   });
// };