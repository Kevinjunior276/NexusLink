import { redirect } from 'next/navigation';

export default function FormRootPage() {
    // Redirect to a default demo ID if visited directly
    redirect('/form/abc123demo');
}
