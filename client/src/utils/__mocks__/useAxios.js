import jest from "jest"
const mockAxios = jest.fn();

mockAxios.get = jest.fn();
mockAxios.post = jest.fn();
mockAxios.put = jest.fn();
mockAxios.delete = jest.fn();

export default mockAxios;