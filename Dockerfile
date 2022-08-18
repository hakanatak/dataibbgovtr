#Uygulamanın base image'ını tanımlar.
FROM node:16

# Uygulamanın directory'sini belirler.
WORKDIR /usr/src/app

# Uygulamanın kullancağı ortam değişkenleri (host,port, user, pass) tanımlanır.


# Uygulamanın bağımlılıklarını yükler. ( * işareti uygulamadaki node modullerini tutan package'larının bilgisini tutan hem package.json, hem de package-lock.json'ı yükler. )
COPY package.json ./

# Npm ile tüm bağımlı package'ları yükler
RUN npm install

# Uygulamanın içerisindeki kodları alır ve docker image'i içerisine aktarır.
COPY . .

# Container’ın docker içinde çalışacağı port adresini belirler.
EXPOSE 3000

# Oluşturulan image Docker container içerisinde çalıştırılırken kullanılacak command'i tanımlar.
CMD [ "npm", "start" ]
