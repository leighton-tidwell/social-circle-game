import React from 'react';
import Head from 'next/head';
import { Navigation, Hero, Rules, Stats, Footer } from '../components/index';

const Home = () => (
  <>
    <Head>
      <title>The Circle</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      {/* Global site tag (gtag.js) - Google Analytics */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: ` window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');`,
        }}
      />
    </Head>
    <Navigation />
    <Hero />
    <Rules />
    <Stats />
    <Footer />
  </>
);
export default Home;
