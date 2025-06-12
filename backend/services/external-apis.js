
async function searchDomainExternal(domain) {
  if (!globalThis.fetch) {
    throw new Error('This application requires Node.js 18+ for built-in fetch support');
  }

  const API_KEY = process.env.WHOISFREAKS_API_KEY;

  try {
    const response = await fetch(`https://api.whoisfreaks.com/v1.0/whois?apiKey=${API_KEY || 'demo'}&whois=live&domainName=${domain}&format=json`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    const isAvailable = !data.domain_registered || data.domain_registered === 'no' || data.domain_registered === false;

    const registrar = data.domain_registrar?.registrar_name ||
      data.registrar?.registrar_name ||
      data.registrar_name ||
      data.registrar ||
      null;

    const createdDate = data.create_date ||
      data.creation_date ||
      data.created_date ||
      data.domain_created ||
      null;

    const updatedDate = data.update_date ||
      data.updated_date ||
      data.last_updated ||
      data.domain_updated ||
      null;

    const expiryDate = data.expiry_date ||
      data.expiration_date ||
      data.expires ||
      data.domain_expires ||
      data.registry_expiry_date ||
      null;

    const nameServers = data.name_servers ?
      (Array.isArray(data.name_servers) ?
        data.name_servers :
        Object.values(data.name_servers).filter(ns => ns)) :
      data.nameservers ||
      [];

    return {
      domain: domain,
      available: isAvailable,
      registrar: registrar,
      createdDate: createdDate,
      updatedDate: updatedDate,
      expiryDate: expiryDate,
      nameServers: nameServers,
      source: 'external',
      provider: 'WhoisFreaks',
      apiResponse: data.whois_server ? `Data from: ${data.whois_server}` : 'WhoisFreaks API'
    };
  } catch (error) {
    try {
      const fallbackResponse = await fetch(`https://api.whoapi.com/?apikey=${process.env.WHOAPI_KEY}&r=taken&domain=${domain}`);

      if (!fallbackResponse.ok) {
        throw new Error(`Fallback API error! status: ${fallbackResponse.status}`);
      }

      const fallbackData = await fallbackResponse.json();

      return {
        domain: domain,
        available: fallbackData.taken === 0 || fallbackData.taken === false,
        registrar: fallbackData.registrar_name || fallbackData.registrar || null,
        createdDate: fallbackData.date_created || null,
        updatedDate: fallbackData.date_updated || null,
        expiryDate: fallbackData.date_expires || null,
        nameServers: fallbackData.nameservers || [],
        source: 'external',
        provider: 'WhoAPI (Fallback)',
        apiResponse: 'WhoAPI Fallback Service'
      };
    } catch (fallbackError) {
      throw new Error(`External API error: ${error.message}. Fallback also failed: ${fallbackError.message}`);
    }
  }
}

module.exports = {
  searchDomainExternal
}; 