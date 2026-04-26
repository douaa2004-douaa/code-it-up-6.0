// Ambient floating bubbles for ocean atmosphere
const BUBBLES = [
  { size: 40,  left: '5%',  delay: '0s',  duration: '12s' },
  { size: 20,  left: '15%', delay: '2s',  duration: '9s'  },
  { size: 60,  left: '25%', delay: '4s',  duration: '15s' },
  { size: 15,  left: '40%', delay: '1s',  duration: '8s'  },
  { size: 35,  left: '55%', delay: '3s',  duration: '11s' },
  { size: 50,  left: '70%', delay: '6s',  duration: '13s' },
  { size: 25,  left: '80%', delay: '0.5s',duration: '10s' },
  { size: 45,  left: '90%', delay: '5s',  duration: '14s' },
  { size: 18,  left: '60%', delay: '7s',  duration: '7s'  },
  { size: 30,  left: '35%', delay: '9s',  duration: '16s' },
]

export default function BubbleBackground() {
  return (
    <>
      {BUBBLES.map((b, i) => (
        <div
          key={i}
          className="bg-bubble"
          style={{
            width: b.size,
            height: b.size,
            left: b.left,
            bottom: '-10%',
            animationDelay: b.delay,
            animationDuration: b.duration,
          }}
        />
      ))}
    </>
  )
}
