export type AppointmentStatus='requested'|'confirmed'|'driver-assigned'|'completed'|'cancelled'|'reschedule-needed';
export type AppointmentInput={invoiceId?:string;orderId?:string;customerName:string;customerEmail:string;customerPhone?:string;deliveryZip?:string;address?:string;routeId?:string;driver?:string;requestedWindow?:string;confirmedDate?:string;confirmedWindow?:string;driverNotes?:string;customerNotes?:string;metadata?:Record<string,any>};
export type AppointmentRecord=AppointmentInput&{id:string;status:AppointmentStatus;confirmationEmailStatus:'pending'|'queued'|'sent'|'failed';createdAt:string;updatedAt:string;confirmedAt?:string;completedAt?:string;cancelledAt?:string};

export function cleanEmail(value:unknown){return String(value||'').trim().toLowerCase()}
export function validEmail(value:unknown){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail(value))}
export function appointmentId(){return `APPT-${Date.now()}`}
export function sanitizeAppointment(input:AppointmentInput){
  const email=cleanEmail(input.customerEmail);
  if(!validEmail(email))throw new Error('Customer email is required before scheduling confirmation.');
  const now=new Date().toISOString();
  const confirmed=Boolean(input.confirmedDate&&input.confirmedWindow);
  return {id:appointmentId(),invoiceId:input.invoiceId,orderId:input.orderId,customerName:String(input.customerName||'Customer').trim(),customerEmail:email,customerPhone:input.customerPhone||'',deliveryZip:input.deliveryZip||'',address:input.address||'',routeId:input.routeId||'',driver:input.driver||'',requestedWindow:input.requestedWindow||'',confirmedDate:input.confirmedDate||'',confirmedWindow:input.confirmedWindow||'',driverNotes:input.driverNotes||'',customerNotes:input.customerNotes||'',metadata:input.metadata||{},status:(confirmed?'confirmed':'requested') as AppointmentStatus,confirmationEmailStatus:'pending' as const,createdAt:now,updatedAt:now,confirmedAt:confirmed?now:undefined};
}
export function appointmentConfirmationEmail(appointment:AppointmentRecord){
  const subject=`Capital City Provisions Delivery Confirmation ${appointment.confirmedDate||appointment.requestedWindow||''}`.trim();
  const body=[`Hello ${appointment.customerName},`,'',appointment.status==='confirmed'?`Your Capital City Provisions delivery window is confirmed.`:`We received your requested delivery window and will confirm the route before dispatch.`, '', `Delivery ZIP: ${appointment.deliveryZip||'TBD'}`, appointment.address?`Address note: ${appointment.address}`:'', appointment.confirmedDate?`Confirmed date: ${appointment.confirmedDate}`:'Date: pending confirmation', appointment.confirmedWindow?`Confirmed window: ${appointment.confirmedWindow}`:appointment.requestedWindow?`Requested window: ${appointment.requestedWindow}`:'Window: pending confirmation', appointment.driver?`Driver: ${appointment.driver}`:'Driver: assigned after route review', '', appointment.customerNotes?`Customer notes: ${appointment.customerNotes}`:'', '', 'We confirm route timing before fulfillment so premium product quality and delivery expectations stay protected.', '', 'Capital City Provisions'].filter(Boolean).join('\n');
  return {subject,body};
}
export function driverAppointmentBrief(appointment:AppointmentRecord){return [`Confirmed stop: ${appointment.customerName}`,`ZIP: ${appointment.deliveryZip||'TBD'}`,`Window: ${appointment.confirmedDate||'TBD'} ${appointment.confirmedWindow||appointment.requestedWindow||''}`.trim(),`Phone: ${appointment.customerPhone||'no phone'}`,`Address: ${appointment.address||'no address note'}`,`Notes: ${appointment.driverNotes||appointment.customerNotes||'none'}`].join('\n')}
