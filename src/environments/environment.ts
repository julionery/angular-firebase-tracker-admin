// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
      apiKey: "AIzaSyCiRDisk1V4rL7hTnflewL7-1lUlez4PHA",
      authDomain: "sansaobus.firebaseapp.com",
      databaseURL: "https://sansaobus.firebaseio.com",
      projectId: "sansaobus",
      storageBucket: "sansaobus.appspot.com",
      messagingSenderId: "494794297862"
  }
};
