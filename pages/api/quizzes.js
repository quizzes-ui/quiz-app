import PocketBase from 'pocketbase';

export default async function handler(req, res) {
    const pb = new PocketBase(process.env.NEXT_PUBLIC_POCKETBASE_URL);

    try {
        // Authenticate as admin
        const authData = await pb.admins.authWithPassword(
            process.env.POCKETBASE_ADMIN_EMAIL,
            process.env.POCKETBASE_ADMIN_PASSWORD
        );

        console.log('Auth valid:', pb.authStore.isValid);
        console.log('Auth token:', pb.authStore.token);
        console.log('Admin ID:', pb.authStore.record.id);

        // Fetch quizzes if authentication is successful
        const records = await pb.collection('quizzes').getFullList({
            sort: '-created',
        });

        res.status(200).json(records);
        
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ 
            error: 'Authentication failed. Check server logs for details.'
        });
    }
}
