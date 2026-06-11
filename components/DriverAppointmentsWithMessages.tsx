'use client';
import {useEffect,useState} from 'react';
import DriverMessageActions from './DriverMessageActions';

export default function DriverAppointmentsWithMessages(){
  const [appointments,setAppointments]=useState<any[]>([]);
  const [notice,setNotice]=useState('Loading appointments...');
  async function load(){
    try{
      const response=await fetch('/api/scheduling/appointments',{credentials:'same-origin'});
      const data=await response.json();
      if(!response.ok||!data.ok)throw new Error(data.message||'Could not load appointments');
      setAppointments(data.appointments||[]);
      setNotice('');
    }catch(error:any){setNotice(error?.message||'Could not load appointments')}
  }
  useEffect(()=>{load()},[]);
  return <section className="section driver-appointments" id="driver-appointments"><div className="owner-board-head"><div><p className="eyebrow">Driver Appointments</p><h2>Appointments plus one-tap customer messages.</h2><p>Tap the situation, review the generated message, open Gmail or mail, then keep the route moving.</p></div><button onClick={load}>Refresh</button></div>{notice&&<p className="sales-save-notice">{notice}</p>}<div className="route-list ops-cards">{appointments.length?appointments.map(appt=><article key={appt.id}><p className="eyebrow">{appt.status}</p><h3>{appt.customerName}</h3><p>{appt.customerPhone||'no phone'} · {appt.customerEmail}</p><p>ZIP {appt.deliveryZip} · Route {appt.routeId||'pending'} · Driver {appt.driver||'assign at dispatch'}</p><p>{appt.confirmedDate||'date pending'} · {appt.confirmedWindow||appt.requestedWindow||'window pending'}</p><p>{appt.driverNotes||appt.customerNotes||'No special notes.'}</p><DriverMessageActions customerName={appt.customerName} customerEmail={appt.customerEmail} zip={appt.deliveryZip} deliveryDate={appt.confirmedDate} deliveryWindow={appt.confirmedWindow||appt.requestedWindow} invoiceNumber={appt.metadata?.invoiceNumber} box="Freezer Box"/></article>):<article><h3>No confirmed appointments yet.</h3><p>Owner can schedule deliveries from the revenue pipeline after invoice and payment review.</p></article>}</div></section>
}
