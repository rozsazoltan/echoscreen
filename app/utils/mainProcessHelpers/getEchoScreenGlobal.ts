import { EchoScreenGlobal } from './EchoScreenGlobal';

export default () => {
  return (global as unknown) as EchoScreenGlobal;
};
