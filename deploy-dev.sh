#打包
npm run build:dev

#同步到服务器
rsync -av --delete dist/* root@39.99.143.150:/data/www/admin-dev
