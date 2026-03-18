export function loadJsonp<T>(url: string, callbackName = "__kinokoru_cb"): Promise<T> {
  return new Promise((resolve, reject) => {
    const w = window as any;
    if (w[callbackName]) delete w[callbackName];

    w[callbackName] = (data: T) => {
      cleanup();
      resolve(data);
    };

    const script = document.createElement("script");
    const sep = url.includes("?") ? "&" : "?";
    script.src = `${url}${sep}callback=${callbackName}&_=${Date.now()}`;
    script.async = true;

    script.onerror = () => {
      cleanup();
      reject(new Error("JSONP load failed"));
    };

    document.body.appendChild(script);

    function cleanup() {
      if (script.parentNode) script.parentNode.removeChild(script);
      try { delete w[callbackName]; } catch {}
    }
  });
}