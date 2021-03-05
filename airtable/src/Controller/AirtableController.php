<?php

namespace Drupal\airtable\Controller;


use Symfony\Component\HttpFoundation\RedirectResponse;
use Drupal\Core\Routing\TrustedRedirectResponse;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Ajax\CommandInterface;
use \Drupal\Core\Url;
use \Symfony\Component\HttpFoundation\Response;
/**
 * Simple page controller for drupal.
 */
define("AIRTABLEAPIKEY", "keyGumRLMILgeHKT5");
define("AIRTABLEENDPOINT", "https://api.airtable.com/v0/app8VSyKWS03y2AwB/SamenBeter%20Tools");
define("AIRTABLEMAXRECORDS", "1000000");
define("AIRTABLEPAGESIZE", "8");

define("AIRTABLEREVIEWSENDPOINT","https://api.airtable.com/v0/app8VSyKWS03y2AwB/Tool%20reviews");


class AirtableController {
    

    
  /**
   * {@inheritdoc}
   */
  public function home($context=null) {
      $records=[];

      //$session = \Drupal::request()->getSession();
      //$session->set('myrequest', array('request'=>$request,'pagination'=>$searchresult_pagination));
          
          $build= array(
              '#theme' => 'zoekresultaat_page',
              '#records'=> $records,
              '#context'=>$context
          );

  //   return new Response(render($build));
     //return render($build);
     return array(
         '#markup' => render($build),
     );

  }
  public function iframe() {
      return AirtableController::home('iframe');
      
  }
  public function iframerecord($toolname, $toolid) {
      return AirtableController::record($toolname, $toolid,'iframe');
      
  }
  
  // om een record te tonen kijken we eerst of het record id mee is gegeven
  // zo ja, gebruiken we die, lekker snel.
  //Zo nee, dan zoeken we op de naam van de tool
  
  public function record($toolname, $toolid, $context=null) {
     // $apikey='keyplWjTpdNRa29aB';
     // $endpoint='https://api.airtable.com/v0/app8VSyKWS03y2AwB/SamenBeter%20Tools';
     // $maxRecords=2000000;
     // $pagesize=100;
      
      
      $apikey=AIRTABLEAPIKEY;
      $endpoint=AIRTABLEENDPOINT;
      $pagesize=AIRTABLEPAGESIZE;
      $maxRecords=AIRTABLEMAXRECORDS;
      
      $count=0;
      $formula="{Titel} = '".$toolname."'";
      $filterByFormula = urlencode($formula);
      
      $records=[];
      $record=[];
      $record['toolname']=$toolname;
      $record['toolid']=$toolid;
      $records[0]=$record;$count=0;
      if ($toolid != 'none') {
          $request=$endpoint.'/'.$toolid.'?api_key='. $apikey;
          $data = file_get_contents($request);
          $searchresults = json_decode($data, TRUE);
          $records=$searchresults;
          \Drupal::logger('jsonapipages')->notice(  $request);
          if (count($records) < 1) {
              $request=$endpoint.'?api_key='. $apikey.'&filterByFormula='.$filterByFormula .'&view=Tools%20-%20Gallery';
              $data = file_get_contents($request);
              $searchresults = json_decode($data, TRUE);
              $records=$searchresults['records'][0]; 
          }
          $count=count($records);// 0 of 3
        
      } 
       else { 
          if ($toolname != ''){
              $request=$endpoint.'?api_key='. $apikey.'&filterByFormula='.$filterByFormula .'&view=Tools%20-%20Gallery';
              $data = file_get_contents($request);
              $searchresults = json_decode($data, TRUE);
              $records=$searchresults['records'][0];
              $count=count($records);// 0 of 3
          }
          
      }
    //  dsm($request);
    //  dsm(count($records));
 //    dsm($records['id']);
    //
  //dsm($records);
      //$session = \Drupal::request()->getSession();
      //$session->set('myrequest', array('request'=>$request,'pagination'=>$searchresult_pagination));
      // Titel (from SamenBeter Tools)
      $reviewsendpoint=AIRTABLEREVIEWSENDPOINT;
      $titel=$records['fields']['Titel'];

      $formula="{Titel (from SamenBeter Tools)} = '".$titel."'";
      $filterByFormula = urlencode($formula);
      $reviewsrequest=$reviewsendpoint.'?api_key='. $apikey.'&filterByFormula='.$filterByFormula .'&view=Grid%20view&maxRecords=3';
      $reviewsdata = file_get_contents($reviewsrequest);

      $reviewssearchresults = json_decode($reviewsdata, TRUE);
      $reviewrecords=[];
     //dsm($reviewssearchresults);
      if (is_array($reviewssearchresults)) {
          if  (array_key_exists('records', $reviewssearchresults)) {
              // dan hebben we echt wel een array
              $reviewrecords=$reviewssearchresults['records'][0];
          }
      }
      
      //dsm($reviewrecords);
      //?maxRecords=3&view=Grid%20view" \
      $build= array(
          '#theme' => 'zoekresultaat_record',
          '#records'=> $records,
          '#reviews'=> $reviewrecords,
          '#context'=> $context
      );
      
      //   return new Response(render($build));
      //return render($build);
      return array(
          '#markup' => render($build),
      );
      
  }
  
  public function zoekresultaat($context=null) {
      // $apikey='keyplWjTpdNRa29aB';
      // $endpoint='https://api.airtable.com/v0/app8VSyKWS03y2AwB/SamenBeter%20Tools';
      // $maxRecords=2000000;
      // $pagesize=100;
      
      
      $apikey=AIRTABLEAPIKEY;
      $endpoint=AIRTABLEENDPOINT;
      $pagesize=AIRTABLEPAGESIZE;
      $maxRecords=AIRTABLEMAXRECORDS;
      
      $overload_pagesize = \Drupal::request()->query->get('pagesize');
    //  \Drupal::logger('jsonapipages')->notice('DDD'.$overload_pagesize);
      $offset=0;
      $overload_offset = \Drupal::request()->query->get('offset');
      //\Drupal::logger('jsonapipages')->notice('DDD'.$overload_offset);
      if ($overload_offset != ''){
          $offset=$overload_offset;
          \Drupal::logger('jsonapipages')->notice('QQQ'.$offset);
      }
      if ($overload_pagesize!=''){
          $pagesize=$overload_pagesize;
          \Drupal::logger('jsonapipages')->notice('QQQ'.$pagesize);
      }
      $iframe = \Drupal::request()->query->get('iframe');
      $query = \Drupal::request()->query->get('query');
      $searchquery='';
      //$formulastatus="OR({Status copy}='klaar voor publicatie',{Status copy}='gepubliceerd',{Status copy}='toegewezen',{Status copy}='draft',{Status copy}='')";
     // $formulastatus="OR({Status copy}='klaar voor publicatie',{Status copy}='gepubliceerd',{Status copy}='toegewezen',{Status copy}='draft')";
  //    $formulastatus="{Status copy}='klaar voor publicatie'";
    //  $formulastatus="OR({Status copy}='klaar voor publicatie',{Status copy}='gepubliceerd')";
      $formulastatus="{Status copy}='gepubliceerd'";
      $formula=$formulastatus;
      $formulaquery='';
      if ( $query != '') {
         $formulaquery="OR(SEARCH(LOWER('".$query."'),LOWER({Titel})),    SEARCH(LOWER('".$query."'), LOWER({Beschrijving})))";
          
      //    $formula=" AND ( (OR(SEARCH(LOWER('".$query."'),LOWER({Titel})),    SEARCH(LOWER('".$query."'), LOWER({Beschrijving})))), ({Status}='klaar voor publicatie') )";
      //    $formula="{Status copy}='klaar voor publicatie'";
          //
          //AND(x,y,OR(AND(a,b),AND(b,c)))
        //  $formula="AND({Status copy}='klaar voor publicatie',OR(SEARCH(LOWER('".$query."'),LOWER({Titel})),    SEARCH(LOWER('".$query."'), LOWER({Beschrijving}))))";
         // $formula="AND(".  $formulastatus.",". $formulaquery.")";
       //   $formula="OR(SEARCH(LOWER('".$query."'),LOWER({Titel})),    SEARCH(LOWER('".$query."'), LOWER({Beschrijving})))";
          //   "draft",
//          "toegewezen",
//          "klaar voor publicatie",
//          "gepubliceerd"
        //  $filterByFormula = urlencode($formula);
        //  $searchquery='&filterByFormula='.$filterByFormula;
      }
      $typefilter = \Drupal::request()->query->get('typefilter');
      $typequery='';
      if ($typefilter && ($typefilter != '')) {
          $searchtypes=explode(',',$typefilter);
          if (count($searchtypes)==1) {
              $typequery='{'."Type".'}'."='".ucfirst($searchtypes[0])."'";
          } else {
              $sep='';
              foreach ($searchtypes as $asearchtype) {
                  $typequery.=$sep.'{'."Type".'}'."='".ucfirst($asearchtype)."'";
                  $sep=',';
              }
              $typequery="OR(".$typequery.")";
          }

         // $formulastatus="OR({Status copy}='klaar voor publicatie',{Status copy}='gepubliceerd',{Status copy}='toegewezen',{Status copy}='draft')";
      }

      $fasefilter = \Drupal::request()->query->get('fasefilter');

      $fasequery='';
      if ($fasefilter && ($fasefilter != '')) {
          $searchfases=explode(',',$fasefilter);

          
          if (count($searchfases)==1) {
              $asearchfase=ucfirst($searchfases[0]);
              \Drupal::logger('jsonapipages')->notice( $asearchfase);
              if ($asearchfase=="Ontdekken") {     $asearchfase="1. ".$asearchfase;}
              if ($asearchfase=="Ontwikkelen") {   $asearchfase="2. ".$asearchfase;}
              if ($asearchfase=="Implementeren") { $asearchfase="3. ".$asearchfase;}
              if ($asearchfase=="Borgen") {        $asearchfase="4. ".$asearchfase;}
              $fasequery='{'."Fase".'}'."='".$asearchfase."'";
          } else {
              $sep='';
              foreach ($searchfases as $asearchfase) {
                  $asearchfase=ucfirst($asearchfase);
                  if ($asearchfase == "Ontdekken") {     $asearchfase = '1. '.$asearchfase;}
                  if ($asearchfase == "Ontwikkelen") {   $asearchfase = '2. '.$asearchfase;}
                  if ($asearchfase == "Implementeren") { $asearchfase = '3. '.$asearchfase;}
                  if ($asearchfase == "Borgen") {        $asearchfase = '4. '.$asearchfase;}
                  $fasequery.=$sep.'{'."Fase".'}'."='".$asearchfase."'";
                  \Drupal::logger('jsonapipages')->error($asearchfase);
                  $sep=',';
              }
              $fasequery="OR(".$fasequery.")";
          }
          
          
      }
      if (($fasequery != '')&&($typequery !='')&&($formulaquery!='')){
          $formula="AND(".  $formulastatus.",". $typequery.",". $fasequery.",". $formulaquery.")";
      } else {
          if ($fasequery == '') {
              if (($typequery !='')&&($formulaquery!='')) {
                  $formula="AND(".  $formulastatus.",". $typeaquery.",". $formulaquery.")";
              }else {
                  if (($typequery !='')&&($formulaquery =='') ) {
                      $formula="AND(".  $formulastatus.",". $typeaquery.")";
                  }
                  if (($formulaquery !='') &&($typequery =='') ){
                      $formula="AND(".  $formulastatus.",". $formulaquery.")";
                  }
                  
              }
              
          }
          if ($typequery =='') {
              if (($fasequery !='')&&($formulaquery!='')) {
                  $formula="AND(".  $formulastatus.",". $fasequery.",". $formulaquery.")";
              }else {
                  if (($fasequery !='')&&($formulaquery =='')) {
                      $formula="AND(".  $formulastatus.",". $fasequery.")";
                  }
                  if (($formulaquery !='')&&($fasequery =='')) {
                      $formula="AND(".  $formulastatus.",". $formulaquery.")";
                  }
                  
              }
              
          }
          if ($formulaquery==''){
              if (($typequery !='')&&($fasequery!='')) {
                  $formula="AND(".  $formulastatus.",". $typequery.",". $fasequery.")";
              }else {
                  if (($typequery !='')&&($fasequery =='') ) {
                      $formula="AND(".  $formulastatus.",". $typequery.")";
                  }
                  if (($fasequery !='')&&($typequery =='') ) {
                      $formula="AND(".  $formulastatus.",". $fasequery.")";
                  }
                  
              }
              
          }
      }
      if (($fasequery == '')&&($typequery =='')&&($formulaquery=='')){
          $formula=$formulastatus;
      }
      
      \Drupal::logger('jsonapipages')->notice('QQQ'.$formula);
      $filterByFormula = urlencode($formula);
      $searchquery='&filterByFormula='.$filterByFormula;
     // $maxRecords=$pagesize;
      $markup='Airtable';

      $request=$endpoint.'?api_key='. $apikey.$searchquery.'&maxRecords='.$maxRecords.'&pageSize='.$pagesize.'&offset='.$offset.'&view=Tools%20-%20Gallery';
      \Drupal::logger('jsonapipages')->notice(  $request);
      $data = file_get_contents($request);
      $searchresults = json_decode($data, TRUE);
    //  dsm($searchresults);
      $records=$searchresults['records'];
      $offset=$searchresults['offset'];
     // dsm($records);
      
      
      //$session = \Drupal::request()->getSession();
      //$session->set('myrequest', array('request'=>$request,'pagination'=>$searchresult_pagination));
      
      $build= array(
          '#theme' => 'zoekresultaat_pages',
          '#records'=> $records,
          '#offset' =>$offset,
          '#query' => $query,
          '#context'=>$iframe,
      );
      
      //   return new Response(render($build));
      //return render($build);
    //  return array(
     //     '#markup' => render($build),
     // );
      $response = new Response();
      $response->setContent( render($build));
      return $response;
      
      
  }
  
  public function redirecttoform() {
      $origin = \Drupal::request()->request->get('origin');
      // evt filteren op origin
      // https://airtable.com/tblGqMmrpYWtzgTrm/viwtljPaR19J8MTcg?blocks=hide
      //https://airtable.com/shr55V7Lxqi583r2Y
      $samenbetertoolbox_formulier="https://airtable.com/shr55V7Lxqi583r2Y";
      $urloftheform=$samenbetertoolbox_formulier.'?'.'prefill_Origin='.urlencode($origin);;   
    //  $urloftheform="http://www.overboord.nl";  
      \Drupal::logger('jsonapipages')->notice('ddd'.$origin.'fff');
    // return new RedirectResponse(\Drupal::url('<front>', [], ['absolute' => TRUE]));
     return new TrustedRedirectResponse($urloftheform);
//     return new TrustedRedirectResponse($urloftheform,['origin'=>urlencode($origin)]);
   //   return new RedirectResponse($urloftheform,['origin'=>urlencode($origin)]);
  }
  
}
