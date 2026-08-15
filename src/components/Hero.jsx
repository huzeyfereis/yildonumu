import LiveCounter from './LiveCounter';
import { years, yearId } from '../content/years';
import { musicControls } from '../lib/musicPlayer';
import './Hero.css';

function Hero() {
  const scrollToStory = () => {
    musicControls.play();
    document
      .getElementById(yearId(years[0].year))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="hero">
      <p className="hero__eyebrow">11 yil tek hikaye</p>
      <h1 className="hero__title">Yıldönümümüz Kutlu Olsun</h1>
      <p className="hero__subtitle">
        hayatimi guzellestirmeye baslayali tam bu kadar oldu
      </p>

      <LiveCounter />

      <button
        type="button"
        className="hero__scroll-hint"
        onClick={scrollToStory}
      >
        <span>hikayemize göz at</span>
        <div className="hero__scroll-arrow" />
      </button>
    </section>
  );
}

export default Hero;
