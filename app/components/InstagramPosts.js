import React, { useEffect } from "react";

const InstagramPosts = () => {
  useEffect(() => {
    const loadLightWidget = () => {
      const lightWidgetScript = document.querySelector(
        'script[src="https://cdn.lightwidget.com/widgets/lightwidget.js"]'
      );

      if (!lightWidgetScript) {
        const script = document.createElement("script");
        script.src = "https://cdn.lightwidget.com/widgets/lightwidget.js";
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Use IntersectionObserver for lazy loading
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadLightWidget();
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const instagramSection = document.getElementById("instagram");
    if (instagramSection) observer.observe(instagramSection);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="p-8" id="instagram">
      <h2 className="text-4xl font-bold text-center mb-8">Latest Cars</h2>
      <div className="flex justify-center">
        <iframe
          src="//lightwidget.com/widgets/c3dc39fa9d6a5283b61e4a913685d4b0.html"
          scrolling="no"
          allowtransparency="true"
          loading="lazy"
          className="lightwidget-widget rounded-lg shadow-lg border-2 border-rose-400"
          style={{
            width: "100%",
            border: "2",
            overflow: "hidden",
            height: "450px",
          }}
        ></iframe>
      </div>
    </section>
  );
};

export default InstagramPosts;
