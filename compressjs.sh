echo "" > src/final.js
cat \
src/injects/startOfInject.js \
src/injects/getPageDetails.js \
src/injects/searchStores.js \
src/injects/getProducts.js \
src/injects/pageStatus.js \
src/injects/endOfInject.js \
> src/final.js
gulp compress
