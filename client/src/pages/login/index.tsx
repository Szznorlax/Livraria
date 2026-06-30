import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import type { AuthenticationResponse, IUserLogin } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { Toast } from "primereact/toast";
import { useAuth } from "@/context/hooks/use-auth";
import "./styles.css";

export const LoginPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserLogin>({ defaultValues: { username: "", password: "" } });  
  const navigate = useNavigate();
  const { login } = AuthService;
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState(false);

  const { handleLogin } =  useAuth(); // A função handleLogin será utilizada para atualizar o contexto com o usuário autenticado.
  const onSubmit = async (userLogin: IUserLogin) => {
    setLoading(true);
    try {
      const response = await login(userLogin);
      if (response.status === 200 && response.data) {
        const authenticationResponse = response.data as AuthenticationResponse; // Define o objeto com token após a autenticação
        handleLogin(authenticationResponse); // o contexto é atualizado com os dados da autenticação
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Login efetuado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao efetuar login.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao efetuar login.",
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="auth-page">
      <Toast ref={toast} />
      <Card className="auth-card">
        <div className="auth-brand">
          <i className="pi pi-book" style={{ fontSize: "2rem", color: "#8b4a1f" }}></i>
          <h1>Bem-vindo de volta</h1>
          <p>Entre para continuar sua jornada literária</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label htmlFor="username">Usuário</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Informe o nome de usuário" }}
              render={({ field }) => (
                <InputText
                  id="username"
                  {...field}
                  className={errors.username ? "p-invalid w-full" : "w-full"}
                />
              )}
            />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="password">Senha</label>
            <Controller
              name="password"
              control={control}
              rules={{ required: "Informe a senha" }}
              render={({ field }) => (
                <Password
                  id="password"
                  {...field}
                  toggleMask
                  feedback={false}
                  className={errors.password ? "p-invalid w-full" : "w-full"}
                  inputClassName="w-full"
                />
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>
          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            className="w-full"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
          />
        </form>
        <div className="auth-link">
          <span>Não tem uma conta? </span>
          <Link to="/register">Criar conta</Link>
        </div>
      </Card>
    </div>
  );
};