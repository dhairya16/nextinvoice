import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import Link from "next/link";
import Container from "@/components/Container";

const Header = () => {
  return (
    <header className='mt-8 mb-12'>
      <Container>
        <div className="flex justify-between items-center gap-4">
          <p className="font-bold">
            <Link href='/dashboard'>Invoicipedia</Link>
          </p>
          <div>
            <SignedOut>
              <SignInButton/>
            </SignedOut>
            <SignedIn>
              <UserButton/>
            </SignedIn>
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header;