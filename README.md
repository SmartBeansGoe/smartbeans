# SmartBeans v3

## What is SmartBeans?

SmartBeans is a gamified learning platform for programming languages.
![](https://github.com/SmartBeansGoe/smartbeans/blob/main/screenshots/dashboard.png)
More screenshots ![here](https://github.com/SmartBeansGoe/smartbeans/blob/main/screenshots)!

## Installation instructions

### Prerequisites

- Install `npm` `nodejs`.
- Install `mysql`

### Installation

1. Clone the repository.
2. Create a database and database user:
   - mysql
   ```sql
   CREATE DATABASE smartbeans;
   CREATE USER 'user'@'localhost' IDENTIFIED BY 'change-this-password';
   GRANT ALL PRIVILEGES ON smartbeans . * TO 'user'@'localhost';
   ```
   - Configure `knexfile.js`
     - change db url
     - change probably the port number
     - add database name
     - add database user
     - add database user password
3. Configure the following on `src/config.ts`:

```js
export default {
  sessionDuration: 43200,
  staticAchievementPath: '/achievements',
  staticAssetPath: '/assets',
  padUrl: 'url-to-hedgedoc',
  sandboxUrl: 'url-to-sandbox',
  achievementUrl: 'url-to-achievement-checker',
  registrationKeys: ['change-me'],
  apiKeys: ['change-me'],
  TOKEN_LENGTH: 36,
  ltiConsumerSecret: 'secret',
  leaderboardUsersLastSubmissionTimeout: 1000 * 60 * 60 * 24 * 30
};
```

4. Initialize the node_modules via running:

```bash
npm install
```

5. Install knex-cli

```
npm install knex -g
```

6. Run migrations

```
knex --esm migrate:latest
```

7. Add assets

- Clone the smartbeans-content repository.
- Run:
  1. `cd smartbeans-content`
  2. `python src/generate-output.py`
  3. `cp out/assets smartbeans/static/assets

8. Build smartbeans

```
npm run build
```

9. Create a systemd service `smartbeans.service`:

```toml
[Unit]
Description=The SmartBeans Backend
After=network.target

[Service]
Type=simple
User=change-me
Group=change-me
WorkingDirectory=path-to-smartbeans-build-folder
ExecStart=PORT=8080 node index.js
Restart=on-failure
# Other restart options: always, on-abort, etc

[Install]
WantedBy=multi-user.target
```

10. Start the service:

```
systemctl start smartbeans.service
```

11. Insert asset ids into smartbeans
    Go in the smartbeans-content repository and run the following:

```
python pipeline.py --url https://smartbeans-domain.tld/api/admin/asset --admin-api-key apikey --data out/assets-backend.json
```

### Updates

For updates call `git pull`, build smartbeans and restart the service.

## License

Copyright (c) 2021 Ole Umlauft and other contributors

All contents of this repository are provided under the MIT License. See [LICENSE](https://github.com/SmartBeansGoe/smartbeans/blob/main/LICENSE) for the full text.
