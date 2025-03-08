Parse.Cloud.beforeSave('_User', async (request) => {
    const { user } = request;

    const email = user.get('email');
    const username = user.get('username');

    if (!email && !username) {
        throw 'Email or Username is required';
    }
});
