import type { IUserRegister, IResponse } from "@/commons/types";
import { api } from "@/lib/axios";

/**
 * Função para realizar uma requisição HTTP para API para cadastrar um novo usuário
 * @param user - Dados do usuário que será cadastrado do tipo IUserRegister
 * @returns - Retorna a resposta da API
 */
const signup = async (user: IUserRegister): Promise<IResponse> => {
  let response = {} as IResponse;
  try {
    const data = await api.post("/users", user);
    response = {
      status: 200,
      success: true,
      message: "Usuário cadastrado com sucesso",
      data: data.data,
    };  
  } catch (err: any) {
    response = {
      status: 400,
      success: false,
      message: "Usuário não pode ser cadastrado",
      data: err.response.data,
    };
  }
  return response;
};
const AuthService = {
  signup,
};
export default AuthService;