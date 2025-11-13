import { DataSourceOptions } from 'typeorm';
declare const _default: () => {
    port: number;
    jwt: {
        secret: string;
        expiresIn: string;
    };
    storage: {
        basePath: string;
    };
    database: DataSourceOptions;
};
export default _default;
