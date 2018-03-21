**instruction**:
zk-admin-web is a zookeeper viewer, which support view multi zookeeper with different tabs. Very easy to use.zk-admin-web is the frontend and zk-viewer is the backend with go and httprouter.
zk-admin-web is developed with reference to https://github.com/taylorchen709/vue-admin.



# To start

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8081
npm run dev

# build for production with minification
npm run build


# build for dev with minification
npm run build_dev

# build for test with minification
npm run build_test

```
# multi env support
  under config folder, there are *.env.js, which ared used for env setting.
  under build folder,there are build_* scripts, which ared used for build setting.
  
  process.env.NODE_ENV = 'development' // used for current env insturction
  process.env.BACKEEND = 'http://10.9.20.161:8080'  //used for backend service definition

