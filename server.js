const express = require('express');
const axios = require('axios');
const NodeCache = require('node-caching');

class CachingProxyServer{
    constructor(port,origin){
        this.port = port;
        this.app = express();
        this.origin = origin;
        this.cache = new NodeCache({stdTTD:3600});
    }

    async handleRequest(req,res){
        const url = `${this.origin.replace(/\/+$/, '')}/${req.originalUrl.replace(/^\/+/, '')}`;
        console.log(`forwarding request to ${url}`);
        const cachedResponse = this.cache.get(url);

        if (cachedResponse){
            res.setHeader('X-cache',"HIT");
            return res.status(200).send(cachedResponse.data);
        }

        try{
            const response = await axois.get(url);
            const responseData = response.data;
            this.cache.set(url,responseData);
            res.setHeader('X-cache','MISS');
            res.status(200).send(responseData);
        }
        catch(error){
            console.error(`Request failed with status code: ${error.response ? error.response.status : 500}`);
            res.status(error.response ? error.response.status : 500).send(error.message);
        }
    }

    start(){
        this.app.get('*',this.handleRequest.bind(this));
        this.app.listen(this.port, () => {
            console.log(`Caching proxy on port: ${this.port}`);
        });
    }

    clearCache(){
        this.cache.flushAll();
    }
}


modules.export = CachingProxyServer;