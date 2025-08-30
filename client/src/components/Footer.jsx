export default function Footer() {
  return (
    <footer className="bg-neutral text-neutral-content p-10">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:justify-between gap-8">
        {/* Services */}
        <nav className="flex-1">
          <h6 className="footer-title text-lg font-semibold mb-3">Services</h6>
          <ul className="space-y-2">
            <li><a className="link link-hover">Branding</a></li>
            <li><a className="link link-hover">Design</a></li>
            <li><a className="link link-hover">Marketing</a></li>
            <li><a className="link link-hover">Advertisement</a></li>
          </ul>
        </nav>

        {/* Company */}
        <nav className="flex-1">
          <h6 className="footer-title text-lg font-semibold mb-3">Company</h6>
          <ul className="space-y-2">
            <li><a className="link link-hover">About us</a></li>
            <li><a className="link link-hover">Contact</a></li>
            <li><a className="link link-hover">Jobs</a></li>
            <li><a className="link link-hover">Press kit</a></li>
          </ul>
        </nav>

        {/* Legal */}
        <nav className="flex-1">
          <h6 className="footer-title text-lg font-semibold mb-3">Legal</h6>
          <ul className="space-y-2">
            <li><a className="link link-hover">Terms of use</a></li>
            <li><a className="link link-hover">Privacy policy</a></li>
            <li><a className="link link-hover">Cookie policy</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
