import React from 'react';

export const FooterSection: React.FC = () => {
  return (
    <div className="top-[1740px] left-0 bg-[#121212] w-full py-6 border-t border-gray-700">
      <div className="w-full max-w-[970px] grid grid-cols-4 gap-8 pl-[37px]">
        {/* Company Column */}
        <div>
          <h3 className="text-white font-bold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {['About', 'Jobs', 'For the Record'].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Communities Column */}
        <div>
          <h3 className="text-white font-bold mb-4">Communities</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {['For Artists', 'Developers', 'Advertising', 'Investors', 'Vendors'].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Useful Links Column */}
        <div>
          <h3 className="text-white font-bold mb-4">Useful links</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {['Support', 'Free Mobile App'].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Plans Column */}
        <div>
          <h3 className="text-white font-bold mb-4">Spotify Plans</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            {[
              'Premium Individual',
              'Premium Duo',
              'Premium Family',
              'Premium Student',
              'Spotify Free'
            ].map((item) => (
              <li key={item}>
                <a href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t border-gray-700 pt-4">
        <div className="flex justify-between items-center px-[37px]">
          <div className="text-sm text-gray-400 space-x-4">
            {['Legal', 'Privacy Policy', 'Cookies', 'About Ads', 'Accessibility'].map((item) => (
              <a key={item} href={`/${item.toLowerCase().replace(/ /g, '-')}`} className="hover:text-white">
                {item}
              </a>
            ))}
          </div>
          <div className="flex space-x-4">
            {['instagram', 'twitter', 'facebook'].map((platform) => (
              <a
                key={platform}
                href={`https://${platform}.com`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <i className={`fab fa-${platform} text-gray-400 text-lg`}></i>
              </a>
            ))}
          </div>
        </div>
        <div className="mt-4 text-gray-400 text-sm text-center">
          © 2025 Spotify AB
        </div>
      </div>
    </div>
  );
};
