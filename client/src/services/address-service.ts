import { api } from '@/lib/axios';
import type { IAddress, IResponse } from '@/commons/types';

const getCurrentUserName = (): string => {
  try {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return '';

    const parsedUser = JSON.parse(storedUser);
    return parsedUser?.username || parsedUser?.displayName || '';
  } catch {
    return '';
  }
};

const getStorageKey = (): string => {
  const userName = getCurrentUserName();
  return `delivery-addresses:${userName || 'anonymous'}`;
};

const readLocalAddress = (): IAddress[] => {
  try {
    const saved = localStorage.getItem(getStorageKey());
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const persistLocalAddress = (address: IAddress[]) => {
  localStorage.setItem(getStorageKey(), JSON.stringify(address));
};

const filterByCurrentUser = (addresses: IAddress[]): IAddress[] => {
  const currentUserName = getCurrentUserName();

  return addresses.filter((address) => {
    if (!currentUserName) return true;
    return !address.userName || address.userName === currentUserName;
  });
};

const findAll = async (): Promise<IResponse> => {
  const localAddress = readLocalAddress();

  if (localAddress.length > 0) {
    return {
      status: 200,
      success: true,
      message: 'Endereços carregados localmente',
      data: localAddress,
    };
  }

  try {
    const data = await api.get('/address');
    const list = Array.isArray(data.data) ? data.data : [];
    const filtered = filterByCurrentUser(list as IAddress[]);

    if (filtered.length > 0) {
      persistLocalAddress(filtered);
    }

    return {
      status: 200,
      success: true,
      message: 'Endereços carregados com sucesso',
      data: filtered,
    };
  } catch {
    return {
      status: 200,
      success: true,
      message: 'Endereço carregado localmente',
      data: localAddress,
    };
  }
};

const create = async (address: IAddress): Promise<IResponse> => {
  const currentUserName = getCurrentUserName();
  const addressToSave = {
    ...address,
    userName: currentUserName,
    id: address.id || Date.now(),
  } as IAddress;

  try {
    const payload = {
      street: address.street,
      number: address.number,
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      recipientName: address.recipientName,
    };

    const data = await api.post('/address', payload);
    const createdAddress = {
      ...(data.data as IAddress),
      userName: currentUserName,
    } as IAddress;

    const localAddress = readLocalAddress();
    persistLocalAddress([...localAddress, createdAddress]);

    return {
      status: 200,
      success: true,
      message: 'Endereço salvo com sucesso',
      data: createdAddress,
    };
  } catch {
    const localAddress = readLocalAddress();
    persistLocalAddress([...localAddress, addressToSave]);

    return {
      status: 200,
      success: true,
      message: 'Endereço salvo localmente',
      data: addressToSave,
    };
  }
};

const AddressService = {
  findAll,
  create,
};

export default AddressService;
