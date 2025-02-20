import { Constructor } from './modules/constructor';
import { meta } from './config/meta.ts';

const App = () => {
  return <Constructor meta={meta} />;
};

export default App;
