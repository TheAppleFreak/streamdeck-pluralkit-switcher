import { Logger, Filter, Human, Browser } from "caterpillar";

const Log = new Logger();
Log.pipe(new Filter({filterLevel: 7})).pipe(new Human()).pipe(new Browser());

export default Log;