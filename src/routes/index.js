import AuthController from '../controllers/AuthController'
import ProductController from '../controllers/ProductController'
import TransactionController from '../controllers/TransactionController'
import { checkAccesToken, checkRefreshToken } from '../middlewares/checkedToken';

export default (app) => {
    app.post('/sign-up', AuthController.signUp);
    app.post('/sign-in', AuthController.signIn);
    app.get('/me', checkAccesToken, AuthController.currentUser);
    app.post('/refresh-token', checkRefreshToken, AuthController.refreshToken);
    app.post('/sign-out', checkRefreshToken, AuthController.signOut);

    app.post('/products', checkAccesToken, ProductController.createProductController)

    app.post('/transactions', checkAccesToken, TransactionController.createTransactionController)
    app.get('/transactions', checkAccesToken, TransactionController.getAllTransactionController)

    app.all('*', (req, res) => res.status(200).send({
        message: 'Route not found',
    }));
};

