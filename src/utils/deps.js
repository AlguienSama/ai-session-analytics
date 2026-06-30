export default class Deps {
    static deps = new Map();
    static get(type) {
        return this.deps.get(type) ?? this.set(type, new type());
    }
    static set(type, instance) {
        this.deps.set(type, instance);
        return instance;
    }
}
