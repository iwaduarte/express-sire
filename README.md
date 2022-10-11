<img src="https://user-images.githubusercontent.com/24816534/194910961-c1f17e78-efb0-4b52-b5ca-fc2cec3da0f5.png" alt="Express Sire Logo" width="358" style="max-width: 100%;">

Express-Sire: [Express ](https://www.npmjs.com/package/express) application generator with flavors.

It brings to the table:
### Customizable features
- ESM Modules or CJS
- Express JSON API
- Git
- Prettier

### Optional modules:
- Sequelize support with Postgres ([sequelize@v6](https://github.com/sequelize/sequelize),
[pg-hstore](https://github.com/scarney81/pg-hstore),
[pg](https://github.com/brianc/node-postgres/tree/master/packages/pg))
 
- [Compression](https://github.com/expressjs/compression)
- [Helmet](https://github.com/helmetjs/helmet)


## Installation

```sh
$ npm install -g express-sire
```

## Get Started

Create the app via __interactive__ cli:

```bash
$ express-sire
```
![express-sire-cli](https://user-images.githubusercontent.com/24816534/194957287-1669c841-f706-41a8-81b6-bdad3bb00acf.png)

Install dependencies:

```bash
$ npm install
```
***
*For Sequelize users*

Populate the .env with POSTGRES credentials

```yaml
DATABASE_NAME=
DATABASE_USER=
DATABASE_PASSWORD=
DATABASE_HOST=
DATABASE_DIALECT="postgres"
```

Create table and properties inside database
```bash
$ npm run update-db;
```

***
Start your app at `http://localhost:3000/`:

```bash
$ npm start
```


# Command Line Options 

```bash
$ express-sire -n <new-project> -a
```

This generator can also be further configured with the following command line flags.

    -a, -all ---------------- Include every configuration same as 
                              express-sire -n <new-project>  -mn -ms cjs -gf -gi -c -h -s)
    -n,  --name <name> ------ Project name (mandatory for raw cli only)
    -mn, --monorepo --------- Add monorepo folders (backend/ and frontend/) (default: false)
    -ms, --modsytem <type> -- Add either cjs|esm. (default: 'cjs') 
    -gi, --gitignore -------- Add .gitignore (default: false)
    -gf, --gitfolder -------- Initialize git folder (default: false)
    -c,  --compression ------ Add compression package (default:false)
    -h,  --helmet ----------- Add helmet sequelize (default:false)
    -s,  --sequelize -------- Add sequelize with Postgres support (default:false)



## License

[MIT](LICENSE)

