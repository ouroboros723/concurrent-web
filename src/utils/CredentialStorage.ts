// eslint-disable-next-line @typescript-eslint/no-extraneous-class
// todo: https://stackoverflow.com/questions/60046847/eslint-does-not-allow-static-class-properties
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class CredentialStorage {
    static importList: string[] = ['PrivateKey', 'Domain', 'SubKey']

    // static importItems(ccid: string, isSetCurrentAccount: boolean = true) : void {
    //     const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}');
    //     credentials[ccid] = ({...credentials[ccid], [key]: value});
    //     localStorage.setItem('credentials', JSON.stringify(credentials));
    //
    //     if(isSetCurrentAccount) {
    //         this.setCurrentAccount(ccid);
    //     }
    // }

    static setItem(key: string, value: string, ccid: string, isSetCurrentAccount: boolean = true): void {
        const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}')
        credentials[ccid] = { ...credentials[ccid], [key]: value }
        localStorage.setItem('credentials', JSON.stringify(credentials))

        if (isSetCurrentAccount) {
            this.setCurrentAccount(ccid)
        }
    }

    static getItem(key: string, ccid: string): string | null {
        const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}')

        return credentials[ccid][key] ?? null
    }

    static getItemAll(ccid: string): object {
        return JSON.parse(localStorage.getItem('credentials') ?? '{}')[ccid] ?? {}
    }

    static destroyItem(key: string, ccid: string): void {
        const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}')

        if (Object.keys(credentials).length > 0) {
            delete credentials[ccid][key]
        }

        localStorage.setItem('credentials', JSON.stringify(credentials))
    }

    static destroyAccount(ccid: string): void {
        const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}')

        if (Object.keys(credentials).length > 0) {
            delete credentials[ccid]
        }

        localStorage.setItem('credentials', JSON.stringify(credentials))
    }

    static setCurrentAccount(ccid: string): void {
        localStorage.setItem('CurrentAccount', ccid)
    }

    static getCurrentAccountItem(key: string): string | null {
        if ((localStorage.getItem('CurrentAccount') ?? null) === null) {
            return null
        }
        const credentials = JSON.parse(localStorage.getItem(`credentials`) ?? '{}')

        // 上記の記述で対策しているためESLintを抑止
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return credentials[localStorage.getItem('CurrentAccount')][key] ?? null
    }

    static getCurrentAccountItemAll(): object {
        if ((localStorage.getItem('CurrentAccount') ?? null) === null) {
            return {}
        }

        // 上記の記述で対策しているためESLintを抑止
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return JSON.parse(localStorage.getItem('credentials') ?? '{}')[localStorage.getItem('CurrentAccount')] ?? {}
    }

    static getAccountItemAll(ccid: string): object {
        // 上記の記述で対策しているためESLintを抑止
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        return JSON.parse(localStorage.getItem('credentials') ?? '{}')[ccid] ?? {}
    }

    static destroyCurrentAccountItem(key: string): void {
        const credentials = JSON.parse(localStorage.getItem('credentials') ?? '{}')

        if (Object.keys(credentials).length > 0 && (localStorage.getItem('CurrentAccount') ?? null) !== null) {
            // 上記の記述で対策しているためESLintを抑止
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            delete credentials[localStorage.getItem('CurrentAccount')][key]
        }

        localStorage.setItem('credentials', JSON.stringify(credentials))
    }
}
