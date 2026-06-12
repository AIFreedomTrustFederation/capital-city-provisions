import PublicTrustReviews from '../../components/PublicTrustReviews';

export const metadata={
  title:'Reviews + Trust | Capital City Provisions',
  description:'Customer service ratings, recovery promise, testimonials, and review links.'
};

export default function ReviewsPage(){
  return (
    <main className="site page-flow">
      <PublicTrustReviews/>
    </main>
  );
}
