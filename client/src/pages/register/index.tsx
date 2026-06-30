import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Link, useNavigate } from "react-router-dom";
import { classNames } from "primereact/utils";
import { useRef, useState } from "react";
import type { IUserRegister } from "@/commons/types";
import AuthService from "@/services/auth-service";
import { Toast } from "primereact/toast";
import "./styles.css";

export const RegisterPage = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IUserRegister>({
    defaultValues: { username: "", password: "", displayName: "" },
  }); // Formulário controlado com React Hook Form
  const { signup } = AuthService; // Método no authService que realiza uma requisição HTTP POST para /users na API
  const [loading, setLoading] = useState(false); // Objeto que controla o estado da requisição HTTP
  const navigate = useNavigate(); // Hook do React Touter para redirecionar o usuário para uma nova rota
  const toast = useRef<Toast>(null); // Hook para possibilitar o uso do componente Toast para exibir as mensagens de sucesso ou erro.

  const onSubmit = async (data: IUserRegister) => { // Função assíncrona para realizar o envio dos dados para API
    setLoading(true);
    try {
      const response = await signup(data);
      if (response.status === 200 && response.data) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: "Usuário cadastrado com sucesso.",
          life: 3000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: "Falha ao cadastrar usuário.",
          life: 3000,
        });
      }
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Falha ao cadastrar usuário.",
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
          <h1>Crie sua conta</h1>
          <p>Comece sua coleção favorita hoje mesmo</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label>Nome de Exibição</label>
            <Controller
              name="displayName"
              control={control}
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={classNames({ "p-invalid": errors.displayName })}
                  placeholder="Ex: João das Neves"
                />
              )}
            />
            {errors.displayName && (
              <small className="p-error">{errors.displayName.message}</small>
            )}
          </div>
          <div className="auth-field">
            <label>Usuário</label>
            <Controller
              name="username"
              control={control}
              rules={{ required: "Campo obrigatório" }}
              render={({ field }) => (
                <InputText
                  {...field}
                  className={classNames({ "p-invalid": errors.username })}
                  placeholder="Ex: jsnow"
                />
              )}
            />
            {errors.username && (
              <small className="p-error">{errors.username.message}</small>
            )}
          </div>
          <div className="auth-field">
            <label>Senha</label>
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Campo obrigatório",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              }}
              render={({ field }) => (
                <Password
                  {...field}
                  toggleMask
                  feedback={false}
                  className={classNames({ "p-invalid": errors.password })}
                />
              )}
            />
            {errors.password && (
              <small className="p-error">{errors.password.message}</small>
            )}
          </div>
          <Button
            type="submit"
            label="Registrar"
            loading={loading || isSubmitting}
            disabled={loading || isSubmitting}
            className="w-full mt-3"
          />
          <div className="auth-link">
            <span>Já tem uma conta? </span>
            <Link to="/login">Fazer login</Link>
          </div>
        </form>
      </Card>
    </div>
  );
};