const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const tvShowProtoPath = 'tvShow.proto';
const tvShowProtoDefinition = protoLoader.loadSync(tvShowProtoPath, {
keepCase: true,
longs: String,
enums: String,
defaults: true,
oneofs: true,
});
const tvShowProto = grpc.loadPackageDefinition(tvShowProtoDefinition).tvShow;

const tvShowService = {
getTvshow: (call, callback) => {

const tv_show = {
id: call.request.tv_show_id,
title: 'Exemple de série TV',
description: 'Ceci est un exemple de série TV.',

};
callback(null, { tv_show });
},
searchTvshows: (call, callback) => {
const { query } = call.request;

const tv_shows = [
{
id: '1',
title: 'Exemple de série TV 1',
description: 'Ceci est le premier exemple de série TV.',
},
{
id: '2',
title: 'Exemple de série TV 2',
description: 'Ceci est le deuxième exemple de série TV.',
},

];
callback(null, { tv_shows });
},

};

const server = new grpc.Server();
server.addService(tvShowProto.TVShowService.service, tvShowService);
const port = 50052;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(),
(err, port) => {
if (err) {
console.error('Échec de la liaison du serveur:', err);
return;
}
console.log(`Le serveur s'exécute sur le port ${port}`);
});
console.log(`Microservice de séries TV en cours d'exécution sur le port
${port}`);