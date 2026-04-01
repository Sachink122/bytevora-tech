(async ()=>{
  try{
    const res = await fetch('https://www.bytevora.in/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({firstName:'Alice', lastName:'Tester', email:'alice@example.test', phone:'12345', service:'Web', projectDetails:'Build site'})})
    console.log('/api/leads',res.status)
    console.log(await res.text())
  }catch(e){console.error(e)}
})()
