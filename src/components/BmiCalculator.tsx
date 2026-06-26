import React, { useState } from 'react';
import { Activity, Info } from 'lucide-react';

export default function BmiCalculator() {
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('175'); // metric: cm, imperial: inches
  const [bmiResult, setBmiResult] = useState<number | null>(null);
  const [status, setStatus] = useState<string>('');
  const [advice, setAdvice] = useState<string>('');

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      alert('Please enter valid, positive numbers.');
      return;
    }

    let bmi = 0;
    if (unit === 'metric') {
      const heightInMeters = h / 100;
      bmi = w / (heightInMeters * heightInMeters);
    } else {
      // Imperial formula: 703 * lbs / inches^2
      bmi = (w / (h * h)) * 703;
    }

    const roundedBmi = parseFloat(bmi.toFixed(1));
    setBmiResult(roundedBmi);

    let classification = '';
    let healthAdvice = '';

    if (roundedBmi < 18.5) {
      classification = 'Underweight';
      healthAdvice = 'Focus on nutrient-dense calorie surplusses and consistent resistance training to build lean muscle mass at MS Fitness.';
    } else if (roundedBmi >= 18.5 && roundedBmi < 25) {
      classification = 'Normal Weight';
      healthAdvice = 'Excellent! You are in a healthy range. Maintain your stamina and metabolic health using our custom HIIT or Strength plans.';
    } else if (roundedBmi >= 25 && roundedBmi < 30) {
      classification = 'Overweight';
      healthAdvice = 'Consider a moderate caloric deficit coupled with a balanced split of cardio and compound lifting sessions in our group classes.';
    } else {
      classification = 'Obese';
      healthAdvice = 'We recommend prioritizing low-impact functional conditioning and strength training to safely improve cardiovascular vitality.';
    }

    setStatus(classification);
    setAdvice(healthAdvice);
  };

  return (
    <section id="bmi-calculator" className="bg-zinc-950 py-20 border-b border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-600 font-semibold tracking-wider uppercase text-xs">Body Metrics</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase mt-1">
            Interactive BMI Calculator
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-zinc-500 text-sm">
            Quickly monitor your body composition ratio to align your workouts with real science and personalized training advice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Input Panel */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-xl flex flex-col justify-between">
            <div>
              {/* Unit Toggles */}
              <div className="flex space-x-2 mb-6">
                <button
                  type="button"
                  onClick={() => { setUnit('metric'); setBmiResult(null); }}
                  className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${unit === 'metric' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  Metric (kg/cm)
                </button>
                <button
                  type="button"
                  onClick={() => { setUnit('imperial'); setBmiResult(null); }}
                  className={`flex-1 py-2 text-xs font-semibold uppercase tracking-wider rounded-md transition-all ${unit === 'imperial' ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                >
                  Imperial (lbs/in)
                </button>
              </div>

              <form onSubmit={calculateBMI} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none text-sm transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Height ({unit === 'metric' ? 'cm' : 'inches'})
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600 text-white px-4 py-3 rounded-lg outline-none text-sm transition-all"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xs font-semibold tracking-widest uppercase py-3.5 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer mt-6"
                >
                  <Activity className="h-4 w-4" /> Calculate BMI
                </button>
              </form>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 sm:p-8 rounded-xl flex flex-col justify-center relative overflow-hidden">
            {bmiResult === null ? (
              <div className="text-center py-12">
                <Info className="h-10 w-10 text-zinc-600 mx-auto mb-4" />
                <p className="text-zinc-500 text-sm">Enter your weight and height metrics and trigger the calculation to receive expert biomechanical classification.</p>
              </div>
            ) : (
              <div className="space-y-6 text-center md:text-left">
                <div>
                  <span className="text-xs uppercase tracking-widest font-mono text-zinc-500">Your Body Mass Index</span>
                  <div className="text-6xl font-black text-red-600 my-2">{bmiResult}</div>
                  <div className="inline-flex items-center bg-zinc-850 px-3 py-1 rounded-full text-xs font-bold text-white border border-zinc-700 uppercase tracking-wider">
                    {status}
                  </div>
                </div>

                {/* Score slider indicator */}
                <div className="h-2 bg-zinc-800 rounded-full w-full relative my-6">
                  <div
                    className="h-full bg-red-600 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, (bmiResult / 40) * 100))}%` }}
                  />
                  <div className="flex justify-between text-[10px] text-zinc-600 font-mono mt-1.5">
                    <span>18.5 (Low)</span>
                    <span>25.0 (Normal)</span>
                    <span>30.0 (Over)</span>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-6">
                  <span className="text-xs font-bold text-zinc-300 block uppercase mb-1">MS Personal Advice:</span>
                  <p className="text-sm text-zinc-500 leading-relaxed">{advice}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
