require('dotenv').config();
console.log('SHOW_OWN_ROOMS_IN_DEV:', `"${process.env.SHOW_OWN_ROOMS_IN_DEV}"`);
console.log('Boolean eval:', process.env.SHOW_OWN_ROOMS_IN_DEV === 'true');
