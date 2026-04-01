(async function(){
  const base = process.argv[2] || 'https://bytevora-tech-j5eg-ejncq9c8z-sachink122s-projects.vercel.app';
  const endpoints = ["/api/team","/api/leads","/api/blog-posts"];
  const fetch = globalThis.fetch || (await import('node-fetch')).default;
  for (const ep of endpoints){
    try{
      const res = await fetch(base+ep,{method:'GET'});
      const ok = res.ok;
      let info = '';
      if (ok){
        try{ const json = await res.json(); if (Array.isArray(json)) info = `count=${json.length}`; else info = `type=${typeof json}` } catch(e){ info = 'json=parse-error' }
      }
      console.log(`${ep} ${ok? 'OK' : 'ERR'} ${res.status} ${info}`);
    }catch(e){
      console.log(`${ep} ERR network`);
    }
  }
  // try POST a test lead
  try{
    const payload = { firstName: 'CI', lastName: 'Test', email: 'ci-test+vercel@local.invalid', phone: '-', service: 'Other' };
    const res = await fetch(base+'/api/leads',{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
    if (res.ok) console.log('/api/leads POST OK '+res.status);
    else console.log('/api/leads POST ERR '+res.status);
  }catch(e){ console.log('/api/leads POST ERR network'); }
})();
