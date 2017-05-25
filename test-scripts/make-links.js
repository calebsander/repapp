const http = require('http')

http.request({
    host: "localhost",
    port: 8000,
    path: "/api/admin/link",
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    }},
    res => {
        res.pipe(process.stdout)
        const chunks = []
        res.on('data', chunk => chunks.push(chunk))
        .on('end', () => {
            const linkData = JSON.parse(Buffer.concat(chunks))
            if (linkData.success) {
                http.get({
                host: "localhost",
                port: 8000,
                path: "/api/admin/link/read-notes/" + linkData.uuid,
                }, res => {
                    res.pipe(process.stdout)
                })
            }
            
        })
    }).end(JSON.stringify({
        collegeName: "Swarthmore"
    }))
