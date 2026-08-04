const dns = require('dns');
dns.setServers(['8.8.8.8']);
dns.resolveSrv('_mongodb._tcp.hipmikatalog.d0ltpsp.mongodb.net', (err, addresses) => {
  if (err) console.error('SRV Error:', err);
  else console.log('SRV:', addresses);
});
dns.resolveTxt('hipmikatalog.d0ltpsp.mongodb.net', (err, records) => {
  if (err) console.error('TXT Error:', err);
  else console.log('TXT:', records);
});
