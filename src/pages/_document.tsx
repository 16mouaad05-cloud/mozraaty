import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ar" dir="rtl">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#22c55e" />
          <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        </Head>
        <body className="bg-gray-50 font-arabic">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
