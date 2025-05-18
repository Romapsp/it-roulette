# IT-Roulette

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Development server
Pre-Conditions: 
- Installed Angular 
- Installed NodeJS
- Installed NVM
- Installed NPM 
- Installed Git


To start a local development server, run:

1. Clone the Repository: 
```bash
git clone https://github.com/Romapsp/it-roulette.git
```

2. Go inside the folder: 
```bash
cd it-roulette 
```

3. Install missing packages: 

```bash
npm install
```

4. Apply 18 Node version by using nvm: 
 
```bash
nvm use 18
```

5. Run the project! 
 
```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Updating Images and its displayed Names 

In order to update the names, you need to do the following steps: 
1. In the root (it-roulette) folder go to /public
2. Open /fakeDB folder 
3. Open PrizeDB.json file
4. Modify the text inside each object to any name you need
5. (!) if you have less than 9 participants, you need to delete the spare objects. If you have more than 9 participants, then simply copy and insert new objects and then modify the names and locations inside the "image" value

In order to update the images, you need to do the following steps: 
1. In the root (it-roulette) folder go to /public
2. Open /prizeImages folder 
3. Put new images in .png extension. Note: the image proportions should be square (i.e. 4x4) in order to be displayed without any disproportions
4. (!) Don't forget to add the spare objects inside the PrizeDB.json in order to display your images 


## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
