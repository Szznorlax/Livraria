import { api } from '@/lib/axios';
import type { IAddress, IResponse } from '@/commons/types';

const STORAGE_KEY = 'delivery-address';

const readLocalAddress = (): IAddress[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const persistLocalAddress = (address: IAddress[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
};

const findAll = async (): Promise<IResponse> => {
  try {
    const data = await api.get('/address');
    return {
      status: 200,
      success: true,
      message: 'Endereços carregados com sucesso',
      data: data.data,
    };
  } catch {
    const localAddress = readLocalAddress();
    return {
      status: 200,
      success: true,
      message: 'Endereço carregado localmente',
      data: localAddress,
    };
  }
};

const create = async (address: IAddress): Promise<IResponse> => {
  try {
    const data = await api.post('/address', address);
    const createdAddress = data.data as IAddress;
    const localAddress = readLocalAddress();
    persistLocalAddress([...localAddress, createdAddress]);

    return {
      status: 200,
      success: true,
      message: 'Endereço salvo com sucesso',
      data: createdAddress,
    };
  } catch {
    const createdAddress = { ...address, id: Date.now() } as IAddress;
    const localAddress = readLocalAddress();
    persistLocalAddress([...localAddress, createdAddress]);

    return {
      status: 200,
      success: true,
      message: 'Endereço salvo localmente',
      data: createdAddress,
    };
  }
};

const AddressService = {
  findAll,
  create,
};

export default AddressService;
