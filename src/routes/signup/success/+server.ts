import { json } from "@sveltejs/kit";

export async function GET({url}) {
  const hash = url.hash;

  var hashMap: Map<string, string | number> = new Map<string,string | number >();

  for( const h of hash.split('&')) {
    const tmp = h.split('=');
    hashMap.set(tmp[0],tmp[1]);
  }

  // console.log(hashMap);

  return json(hashMap);
}