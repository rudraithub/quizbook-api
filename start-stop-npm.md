To run `npm run dev` in the background, you can use a process manager like `pm2`. Here's how you can do it:

1. **Install `pm2` globally:**

   If you haven't installed `pm2` yet, you can do so by running:
   ```bash
   npm install pm2 -g
   ```

2. **Start your `npm run dev` script with `pm2`:**

   Navigate to your project directory and run the following command:
   ```bash
   pm2 start npm --name "my-app" -- run dev
   ```

   This will start your `npm run dev` script with `pm2` and give it the name "my-app".

3. **Monitor your process:**

   You can monitor your running process using:
   ```bash
   pm2 monit
   ```

4. **Managing your process:**

   You can manage your process using various `pm2` commands like `stop`, `restart`, `delete`, etc. For example:
   ```bash
   pm2 stop my-app
   ```

By using `pm2`, your `npm run dev` script will run in the background, and you can manage it easily. Make sure to replace `"my-app"` with a suitable name for your application.