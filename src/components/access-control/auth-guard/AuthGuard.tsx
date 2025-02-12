import { Navigate, Outlet } from "react-router";
import { useSnackbar } from 'notistack';
import AuthService from "../../../services/auth/AuthService";


const AuthGuard = () => {
    const { enqueueSnackbar } = useSnackbar();

    const isAuthenticated = AuthService.isAuthenticated();
    if (!isAuthenticated) {
        enqueueSnackbar('Sua sessão expirou. Por favor, faça login novamente para continuar.', { variant: "info", preventDuplicate: true });
        return <Navigate to="/" replace />;
    }
    return <Outlet />;
};
export default AuthGuard;