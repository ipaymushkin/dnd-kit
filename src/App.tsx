import { Constructor } from './modules/constructor';
import { meta } from './config/meta.ts';
import { generateItems } from './modules/constructor/utils/generateItems.ts';
import { Items } from './config/types.ts';

const App = () => {
  const items = generateItems({ meta, count: 50 }) as Items[];
  return <Constructor meta={meta} list={items} />;
};

export default App;
