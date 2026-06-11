import {redirect} from 'next/navigation';

export const metadata={title:'Driver Setup | Capital City Provisions',description:'Driver setup redirects to the persistent driver profile workspace.'};

export default function DriverSetupPage(){redirect('/driver-profile')}
