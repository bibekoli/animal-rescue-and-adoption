import { Icon } from "@iconify/react";

export default function Footer() {
  return (
    <footer className="bg-indigo-500 text-white">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">About Us</h2>
            <p>
              We are a community of animal lovers who are dedicated to helping
              animals in need.
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Contact Us</h2>
            <p>
              Email: <a href="mailto:contact@bibekoli.com">contact@bibekoli.com</a>
            </p>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Follow Us</h2>
            <div className="flex gap-4">
              <Icon icon="akar-icons:facebook-fill" width={24} height={24} />
              <Icon icon="akar-icons:instagram-fill" width={24} height={24} />
              <Icon icon="akar-icons:twitter-fill" width={24} height={24} />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
